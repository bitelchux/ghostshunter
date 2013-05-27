<?php
require_once('includes/config.php');
require_once('includes/functions/func.global.php');
require_once('includes/classes/class.template_engine.php');

// Connect to database
db_connect($config);

// Start the session
session_start();

// Get usergroup details
$usergroup = check_user_group($config);

// Initiate return var
$digs[0] = 0;

// If no type then it's for a story
if(!isset($_GET['type']))
{
	$_GET['type'] = 'story';
}
$cuantos=1;
if ($_GET["x"]!="")
  $cuantos=10;
// Check user is logged in
//if(isset($_SESSION['duser']['id']))
if (1==1)
{
	if($_GET['type'] == 'story')
	{
		if(!isset($_SESSION['dugg'][$_GET['i']]))
		{
			// Lookup digs table to see if they have already dugg this
			$dugg = mysql_num_rows(mysql_query("SELECT 1 FROM ".$config['db']['pre']."digs WHERE story_id='".validate_input($_GET['i'])."' AND user_id='".$_SESSION['duser']['id']."' LIMIT 1"));
		
			// Check that they havn't dugg it
			if(!$dugg)
			{
				// Update dugg count on story
				mysql_query("UPDATE `".$config['db']['pre']."stories` SET `story_digs` = story_digs+$cuantos,`story_last5` = story_last5+1 WHERE `story_id` =".validate_input($_GET['i'])." LIMIT 1 ;");
				// Insert digg into digs table
				mysql_query("INSERT INTO `".$config['db']['pre']."digs` ( `story_id` , `user_id` , `time` ) VALUES ('".validate_input($_GET['i'])."', '".$_SESSION['duser']['id']."', '".time()."');");
			
				// Check number of digs on story
				$digs = mysql_fetch_row(mysql_query("SELECT story_digs FROM ".$config['db']['pre']."stories WHERE story_id='".validate_input($_GET['i'])."' LIMIT 1"));
				
				// Register that they have dugg this story in session
				$_SESSION['dugg'][$_GET['i']] = true;
				
				// Return success and number of digs
				echo '1|'.$_GET['i'].'|'.$digs[0];
			}
			else
			{
				// User has already dugg this story
				echo '2|'.$_GET['i'].'|'.$digs[0];
			}
		}
    	else
		{
			// User has already dugg this story
			echo '2|'.$_GET['i'].'|'.$digs[0];
		}
	}
	elseif($_GET['type'] == 'comm')
	{
		// Lookup digs table to see if they have already dugg this
		$dugg = mysql_num_rows(mysql_query("SELECT 1 FROM ".$config['db']['pre']."cdigs WHERE comment_id='".validate_input($_GET['i'])."' AND user_id='".$_SESSION['duser']['id']."' LIMIT 1"));
	
		// Check that they havn't dugg it
		if(!$dugg)
		{
			// Update dugg count on story
			if($_GET['dir'])
			{
				mysql_query("UPDATE `".$config['db']['pre']."comm` SET `comment_digs` = comment_digs+1 WHERE `comment_id` =".validate_input($_GET['i'])." LIMIT 1 ;");
				// Insert digg into digs table
				mysql_query("INSERT INTO `".$config['db']['pre']."cdigs` ( `comment_id` , `user_id` , `story_id` , `time` , `dig` ) VALUES ('".validate_input($_GET['i'])."', '".$_SESSION['duser']['id']."', '".validate_input($_GET['story'])."', '".time()."', '1');");
			}
			else
			{
				mysql_query("UPDATE `".$config['db']['pre']."comm` SET `comment_digs` = comment_digs-1 WHERE `comment_id` =".validate_input($_GET['i'])." LIMIT 1 ;");
				// Insert digg into digs table
				mysql_query("INSERT INTO `".$config['db']['pre']."cdigs` ( `comment_id` , `user_id` , `story_id` , `time` , `dig` ) VALUES ('".validate_input($_GET['i'])."', '".$_SESSION['duser']['id']."', '".validate_input($_GET['story'])."', '".time()."', '-1');");
			}
		
			// Check number of digs on story
			$digs = mysql_fetch_row(mysql_query("SELECT comment_digs FROM ".$config['db']['pre']."comm WHERE comment_id='".validate_input($_GET['i'])."' LIMIT 1"));
			
			if($digs[0] > -1)
			{
				$digs[0] = '+'.$digs[0];
			}
			
			// Return success and number of digs
			echo '1|'.$_GET['i'].'|'.$digs[0];
		}
		else
		{
			// User has already dugg this story
			echo '2|'.$_GET['i'].'|'.$digs[0];
		}
	}
}
else
{
	$user_ip = encode_ip($_SERVER,$_ENV);
	
	if($_GET['type'] == 'story')
	{
		if($usergroup['group_dig'] == '1')
		{
			if(!isset($_SESSION['dugg'][$_GET['i']]))
			{
				// Lookup digs table to see if they have already dugg this
				$dugg = mysql_num_rows(mysql_query("SELECT 1 FROM ".$config['db']['pre']."digs WHERE story_id='".validate_input($_GET['i'])."' AND user_ip='".validate_input(ip2long($user_ip))."' LIMIT 1"));
			
				// Check that they havn't dugg it
				if(!$dugg)
				{
					// Update dugg count on story
					mysql_query("UPDATE `".$config['db']['pre']."stories` SET `story_digs` = story_digs+1,`story_last5` = story_last5+1 WHERE `story_id` =".validate_input($_GET['i'])." LIMIT 1 ;");
					// Insert digg into digs table
					mysql_query("INSERT INTO `".$config['db']['pre']."digs` ( `story_id` , `user_ip` , `time` ) VALUES ('".validate_input($_GET['i'])."', '".validate_input(ip2long($user_ip))."', '".time()."');");
				
					// Check number of digs on story
					$digs = mysql_fetch_row(mysql_query("SELECT story_digs FROM ".$config['db']['pre']."stories WHERE story_id='".validate_input($_GET['i'])."' LIMIT 1"));
					
					// Register that they have dugg this story in session
					$_SESSION['dugg'][$_GET['i']] = true;
					
					// Return success and number of digs
					echo '1|'.$_GET['i'].'|'.$digs[0];
				}
				else
				{
					// User has already dugg this story
					echo '2|'.$_GET['i'].'|'.$digs[0];
				}
			}
			else
			{
				// User has already dugg this story
				echo '2|'.$_GET['i'].'|'.$digs[0];
			}
		}
		else
		{
			// User isn't logged in
			echo '0|'.$_GET['i'].'|'.$digs[0];
		}
	}
	elseif($_GET['type'] == 'comm')
	{
		if($usergroup['group_cdig'] == '1')
		{
			// Lookup digs table to see if they have already dugg this
			$dugg = mysql_num_rows(mysql_query("SELECT 1 FROM ".$config['db']['pre']."cdigs WHERE comment_id='".validate_input($_GET['i'])."' AND user_ip='".validate_input(ip2long($user_ip))."' LIMIT 1"));
		
			// Check that they havn't dugg it
			if(!$dugg)
			{
				// Update dugg count on story
				if($_GET['dir'])
				{
					mysql_query("UPDATE `".$config['db']['pre']."comm` SET `comment_digs` = comment_digs+1 WHERE `comment_id` =".validate_input($_GET['i'])." LIMIT 1 ;");
					// Insert digg into digs table
					mysql_query("INSERT INTO `".$config['db']['pre']."cdigs` ( `comment_id` , `user_ip` , `story_id` , `time` , `dig` ) VALUES ('".validate_input($_GET['i'])."', '".validate_input(ip2long($user_ip))."', '".validate_input($_GET['story'])."', '".time()."', '1');");
				}
				else
				{
					mysql_query("UPDATE `".$config['db']['pre']."comm` SET `comment_digs` = comment_digs-1 WHERE `comment_id` =".validate_input($_GET['i'])." LIMIT 1 ;");
					// Insert digg into digs table
					mysql_query("INSERT INTO `".$config['db']['pre']."cdigs` ( `comment_id` , `user_ip` , `story_id` , `time` , `dig` ) VALUES ('".validate_input($_GET['i'])."', '".validate_input(ip2long($user_ip))."', '".validate_input($_GET['story'])."', '".time()."', '-1');");
				}
			
				// Check number of digs on story
				$digs = mysql_fetch_row(mysql_query("SELECT comment_digs FROM ".$config['db']['pre']."comm WHERE comment_id='".validate_input($_GET['i'])."' LIMIT 1"));
				
				if($digs[0] > -1)
				{
					$digs[0] = '+'.$digs[0];
				}
				
				// Return success and number of digs
				echo '1|'.$_GET['i'].'|'.$digs[0];
			}
			else
			{
				// User has already dugg this story
				echo '2|'.$_GET['i'].'|'.$digs[0];
			}
		}
		else
		{
			// User isn't logged in
			echo '0|'.$_GET['i'].'|'.$digs[0];
		}
	}
}
?>