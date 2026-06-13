def firstOccurrence(nums):
    left = 0
    right= len(nums)
    ans=-1
    if(nums[-1]==2):
        return -1
    while(left<=right):
        mid= (left+right)//2
        # print(mid,"it is mid",left,right)
        if(nums[mid]==2):
            left=mid+1
        else:
            ans = mid
            right=mid-1
        # print(mid,"now it is mid",left,right)
    return ans