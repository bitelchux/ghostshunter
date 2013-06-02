<?php
require_once('includes/config.php');
require_once('includes/functions/func.global.php');
require_once('includes/classes/class.template_engine.php');
require_once('includes/lang/lang_'.$config['lang'].'.php');

// Start the session
session_start();

// Connect to the database
db_connect($config);

header('Content-type: text/xml');

switch ($_GET['cmd']) 
{
	case 'spy':
		echo '<?xml version="1.0"?>';
		echo "<items>\r\n";
		echo "<item>\r\n";
		echo "<title>TIME</title>\r\n";
		echo "<link></link>\r\n";
		echo "<digs>0</digs>\r\n";
		echo "<pubDate>".time()."</pubDate>\r\n";
		echo "</item>\r\n";
		
		if($_GET['time'])
		{
			$user_where = '';
			$story_where = '';
			$dig_count = 0;
			$digs = array();
			$stories = array();
			
			$query = "SELECT story_id,time FROM ".$config['db']['pre']."digs WHERE time>'".addslashes($_GET['time'])."' LIMIT 20";
			$query_result = @mysql_query ($query) OR error(mysql_error(), __LINE__, __FILE__, 0, '', '');
			while ($info = @mysql_fetch_array($query_result))
			{
				$digs[$dig_count] = $info;
				
				if($story_where == '')
				{
					$story_where = "WHERE story_id='".$info['story_id']."'";
				}
				else
				{
					$story_where.= " OR story_id='".$info['story_id']."'";
				}
				
				$dig_count++;
			}
			
			if($story_where != '')
			{
				$query = "SELECT story_id,story_title,story_digs FROM ".$config['db']['pre']."stories ".$story_where." LIMIT ".$dig_count;
				$query_result = @mysql_query ($query) OR error(mysql_error(), __LINE__, __FILE__, 0, '', '');
				while ($info = @mysql_fetch_array($query_result))
				{
					$stories[$info['story_id']] = $info;
				}
			}
			
			foreach ($digs as $key => $info) 
			{
				$story = $stories[$info['story_id']];
			
				if($config['mod_rewrite'] == 1)
				{
					$story_link = $config['site_url'].'stories/'.$info['story_id'].'/'.modrewriteurl($story['story_title']).'.html';
				}
				else
				{
					$story_link = $config['site_url'].'story.php?id='.$info['story_id'];
				}
			
				echo "<item>\r\n";
				echo "<title>".$story['story_title']."</title>\r\n";
				echo "<link>".$story_link."</link>\r\n";
				echo "<digs>".$story['story_digs']."</digs>\r\n";
				echo "<pubDate>".$info['time']."</pubDate>\r\n";
				echo "</item>\r\n";
			}
		}
		
		echo "</items>\r\n";
		break;
	case 'popular':
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		echo '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">';
		echo "<channel>\r\n";
		echo "<title>".$config['site_title']."</title>\r\n";
		echo "<language>en-us</language>\r\n";
		echo '<atom:link href="'.$config['site_url'].'xmlfeeds.php?cmd=popular" rel="self" type="application/rss+xml" />';
		echo "<link>".$config['site_url']."</link>\r\n";
		echo "<description>".$config['site_title']."</description>\r\n";
		
		if(isset($_GET['id']))
		{
			$query = "SELECT story_id,story_title,story_desc,story_cat,story_digs,story_url,story_comments,user_name,user_id,story_thumb,story_time FROM ".$config['db']['pre']."stories WHERE story_cat='".addslashes($_GET['id'])."' ORDER BY story_time DESC LIMIT 0,30";
		}
		else
		{
			$query = "SELECT story_id,story_title,story_desc,story_cat,story_digs,story_url,story_comments,user_name,user_id,story_thumb,story_time FROM ".$config['db']['pre']."stories ORDER BY story_time DESC LIMIT 0,30";
		}
		$query_result = @mysql_query ($query) OR error(mysql_error(), __LINE__, __FILE__, 0, '', '');
		while ($info = @mysql_fetch_array($query_result))
		{
			$info['story_title'] = str_replace("&","&amp;",stripslashes($info['story_title']));
			$info['story_title'] = str_replace('<','&lt;',$info['story_title']);
			$info['story_title'] = str_replace('>','&gt;',$info['story_title']);
			$info['story_desc'] = str_replace("&","&amp;",stripslashes($info['story_desc']));
			$info['story_desc'] = str_replace('<','&lt;',$info['story_desc']);
			$info['story_desc'] = str_replace('>','&gt;',$info['story_desc']);
			$info['story_desc'] = str_replace('&lt;br /&gt;','<br />',$info['story_desc']);
			$info['story_desc'] = str_replace('&lt;br&gt;','<br>',$info['story_desc']);
		
			if($config['mod_rewrite'] == 1)
			{
				$story_link = $config['site_url'].'stories/'.$info['story_id'].'/'.modrewriteurl($info['story_title']).'.html';
			}
			else
			{
				$story_link = $config['site_url'].'story.php?id='.$info['story_id'];
			}
		
			echo "<item>\r\n";
			echo "<title>".$info['story_title']."</title>\r\n";
			echo "<link>".$story_link."</link>\r\n";
			echo '<guid>' . $story_link . '</guid>';
			echo "<description><![CDATA[".$info['story_desc']."]]></description>\r\n";
			echo "<pubDate>".date("r",$info['story_time'])."</pubDate>\r\n";
			echo "</item>\r\n";
		}
		
		echo "</channel>\r\n";
		echo "</rss>\r\n";
		break;
	case 'upcoming':
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		echo '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">';
		echo "<channel>\r\n";
		echo "<title>".$config['site_title']."</title>\r\n";
		echo "<language>en-us</language>\r\n";
		echo '<atom:link href="'.$config['site_url'].'xmlfeeds.php?cmd=popular" rel="self" type="application/rss+xml" />';
		echo "<link>".$config['site_url']."</link>\r\n";
		echo "<description>".$config['site_title']."</description>\r\n";
		
		$backtime = (time()-$config['upcomtime']);
		
		if(isset($_GET['id']))
		{
			$query = "SELECT story_id,story_title,story_desc,story_digs,story_url,story_comments,user_id,user_name,story_thumb,story_time,story_cat FROM ".$config['db']['pre']."stories WHERE story_cat='".addslashes($_GET['id'])."' AND story_time>".$backtime." ORDER BY story_time DESC LIMIT 0,10";
		}
		else
		{
			$query = "SELECT story_id,story_title,story_desc,story_digs,story_url,story_comments,user_id,user_name,story_thumb,story_time,story_cat FROM ".$config['db']['pre']."stories WHERE story_time>".$backtime." ORDER BY story_time DESC LIMIT 0,10";
		}
		$query_result = @mysql_query ($query) OR error(mysql_error(), __LINE__, __FILE__, 0, '', '');
		while ($info = @mysql_fetch_array($query_result))
		{
			$info['story_title'] = str_replace("&","&amp;",stripslashes($info['story_title']));
			$info['story_title'] = str_replace('<','&lt;',$info['story_title']);
			$info['story_title'] = str_replace('>','&gt;',$info['story_title']);
			$info['story_desc'] = str_replace("&","&amp;",stripslashes($info['story_desc']));
			$info['story_desc'] = str_replace('<','&lt;',$info['story_desc']);
			$info['story_desc'] = str_replace('>','&gt;',$info['story_desc']);
			$info['story_desc'] = str_replace('&lt;br /&gt;','<br />',$info['story_desc']);
			$info['story_desc'] = str_replace('&lt;br&gt;','<br>',$info['story_desc']);
		
			if($config['mod_rewrite'] == 1)
			{
				$story_link = $config['site_url'].'stories/'.$info['story_id'].'/'.modrewriteurl($info['story_title']).'.html';
			}
			else
			{
				$story_link = $config['site_url'].'story.php?id='.$info['story_id'];
			}
		
			echo "<item>\r\n";
			echo "<title>".$info['story_title']."</title>\r\n";
			echo "<link>".$story_link."</link>\r\n";
			echo '<guid>' . $story_link . '</guid>';
			echo "<description><![CDATA[".$info['story_desc']."]]></description>\r\n";
			echo "<pubDate>".date("D, j M Y H:i:s T",$info['story_time'])."</pubDate>\r\n";
			echo "</item>\r\n";
		}
		
		echo "</channel>\r\n";
		echo "</rss>\r\n";
		break;
}
?>