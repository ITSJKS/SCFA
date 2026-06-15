def firstOccurrence(nums):
    n=len(nums)
    # nums.sort() 
    s=0
    e=len(nums)-1
    ans=-1

    while s<=e:
        mid=(s+e )//2
        if nums[mid]==1:
            ans=mid
            e=mid-1 
        else:
            s=mid+1
    
    return ans


    
    # return -1